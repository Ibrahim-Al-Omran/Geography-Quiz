import './Toggle.css'; // assuming you have styles here

const Toggle = ({ onToggle }) => {
  const handlgeChange = (e) => {
    const isChecked = e.target.checked;
    onToggle(isChecked);
  }
  return (
    <label className="switch">
      <input type="checkbox" onChange={(e) => onToggle(e.target.checked)} />
      <span className="slider"></span>
    </label>
  );
};

export default Toggle;
