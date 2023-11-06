import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/ruby/ruby.js';
import 'codemirror/mode/php/php.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/edit/closetag';
import { ACTIONS, ROOMIDS, ROOMDETAILS } from '../Actions.js';
import BasicSelect from './SelectLanguage.js';
import { useNavigate } from 'react-router-dom';
const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const reactNavigator = useNavigate();
    console.log("editor")
    console.count("edt")
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            if (!editorRef.current) {
                // Initialize CodeMirror only if it's not already initialized
                console.log(ROOMDETAILS[roomId])
                editorRef.current = Codemirror.fromTextArea(
                    document.getElementById('realtimeEditor'),
                    {
                        mode: ROOMDETAILS[roomId], // Adjust this as needed
                        theme: 'dracula',
                        lineNumbers: true
                    }
                );

                editorRef.current?.on('change', (instance, changes) => {
                    const { origin, to } = changes;
                    const { ch, line } = to;
                    const code = instance.getValue();
                    onCodeChange(code);
                    if (origin !== 'setValue') {
                        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                            roomId,
                            code,
                            line,
                            ch
                        });
                    }
                });
                // Attach the selection change event handler
                editorRef.current.on('beforeSelectionChange', (instance, changeObj) => {
                    if (changeObj.ranges.length > 0) {
                        // Text is selected
                        if (changeObj.ranges[0].anchor?.line != changeObj.ranges[0].head?.line ||
                            changeObj.ranges[0].anchor?.ch != changeObj.ranges[0].head?.ch) {
                            console.log('Text is select', changeObj.ranges);
                            const { anchor, head } = changeObj.ranges[0]
                            socketRef.current.emit(ACTIONS.SELECT, {
                                roomId,
                                anchor,
                                head
                            });
                        }

                    } else {
                        // No text is selected
                        console.log('No text is selected');
                    }
                });

            }
        }
        init();
        return () => {
            if (editorRef.current) {
                editorRef.current.toTextArea();
                editorRef.current = null;
            }
            socketRef.current?.off(ACTIONS.SELECT);
            socketRef.current?.off(ACTIONS.CODE_CHANGE);
        };
    }, [roomId]);
    useEffect(() => {
        let x;
        if (socketRef.current) {
            socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }, line, ch) => {
                // console.log("to", line);
                // Clear existing marks before re-adding them
                editorRef.current.getAllMarks().forEach(mark => mark.clear());
                // selections.forEach((selection) => {
                //     editorRef.current.markText(
                //         selection.from,
                //         selection.to,
                //         {
                //             className: 'user-selection',
                //             title: selection.username, // Add user-specific information
                //         }
                //     );
                // });
                if (code !== null) {
                    editorRef.current?.setValue(code);
                    // editorRef?.current?.focus();
                    // x = line && ch && setTimeout(() => {
                    //     editorRef?.current?.setCursor({
                    //         line: line,
                    //         ch: ch,
                    //     })

                    // }, 0);
                }
            });
            socketRef.current?.on(ACTIONS.SELECT, (anchor, head) => {
                console.log("anchor", anchor);
                // editorRef?.current?.focus();
                const { line, ch } = anchor;
                editorRef.current?.markText(
                    { line: line, ch: ch },
                    { line: head["line"], ch: head["ch"] },
                    {
                        className: 'user-selection'
                    }
                );
            });
        }
        return () => {
            clearTimeout(x);
            socketRef?.current?.off(ACTIONS.CODE_CHANGE);
            socketRef?.current?.off(ACTIONS.SELECT);
        };
    }, [socketRef.current, roomId]);
    const handleNavigation = (type) => {
        console.log(`/editor/${ROOMIDS[ROOMDETAILS[type]]}`);
        reactNavigator(`/editor/${ROOMIDS[ROOMDETAILS[type]]}`, { replace: true });
    }
    return (
        <>
            <BasicSelect handleNavigation={handleNavigation} roomId={roomId} />
            <textarea id="realtimeEditor"></textarea>
        </>
    )
};

export default Editor;