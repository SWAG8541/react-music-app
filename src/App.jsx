import WeeklyPicker from "./WeeklyPicker";
//import MusicPlayer from "./MusicPlayer";

const App = () => {
  const handleWeekChange = (week) => {
    console.log("Selected Week:", week);
  };

  return (
    <div>
    <WeeklyPicker />
    </div>
  );
};

export default App;
