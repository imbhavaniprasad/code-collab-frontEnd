import { ROOMDETAILS, ROOMIDS, LanguageMap } from '../Actions';

export default function BasicSelect({ handleNavigation, roomId }) {

    const handleChange = (event) => {
        handleNavigation(event.target.value);
    };
    const styles = {
        position: "absolute",
        top: "10px",
        right: "20px",
    };
    return (
        <select style={styles} onChange={handleChange} value={roomId}>
            {LanguageMap.map((language) => (
                <option key={language.mode} value={language.mode}>
                    {language.name}
                </option>
            ))}
        </select>
    );
}