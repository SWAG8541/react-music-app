import { useState, useRef, useEffect } from "react";
import { IconButton, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const WeeklyPicker = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today
  const [highlightedDate, setHighlightedDate] = useState(selectedDate.format("YYYY-MM-DD")); // Track exact selected date
  const [openPicker, setOpenPicker] = useState(false); // Control DatePicker visibility
  const calendarRef = useRef(null); // Reference for calendar button

  // Get all days from Monday to Sunday based on any date
  const getWeekDays = (date) => {
    const startOfWeek = dayjs(date).isoWeekday(1); // Always start on Monday
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  };

  const [weekDays, setWeekDays] = useState(getWeekDays(selectedDate));

  useEffect(() => {
    setWeekDays(getWeekDays(selectedDate)); // Update the week when selectedDate changes
    setHighlightedDate(selectedDate.format("YYYY-MM-DD")); // Ensure highlight updates

    if (onChange) {
      onChange({
        startOfWeek: weekDays[0].format("YYYY-MM-DD"),
        endOfWeek: weekDays[6].format("YYYY-MM-DD"),
      });
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (!date) return;
    setSelectedDate(dayjs(date)); // Set exact selected date
    setHighlightedDate(dayjs(date).format("YYYY-MM-DD")); // Ensure highlight follows selection
  };

  const goToPreviousWeek = () => setSelectedDate((prev) => prev.subtract(7, "day"));
  const goToNextWeek = () => setSelectedDate((prev) => prev.add(7, "day"));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Header: Week Navigation */}
      <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" gap={1} mb={2} position="relative">
        <IconButton onClick={goToPreviousWeek}>
          <ChevronLeftIcon sx={{ color: "grey.500" }} />
        </IconButton>

        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {weekDays[0].format("ddd, MMM D")} - {weekDays[6].format("ddd, MMM D")}
        </Typography>

        <IconButton ref={calendarRef} onClick={() => setOpenPicker(true)}>
          <CalendarTodayIcon sx={{ color: "grey.500" }} />
        </IconButton>

        {/* Hidden Date Picker */}
        <DatePicker
          sx={{ width: 0, height: 0, position: "absolute", top: 0, right: "25px", bottom: 0, opacity: 0 }}
          value={selectedDate}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          open={openPicker}
          onClose={() => setOpenPicker(false)}
          PopperProps={{
            disablePortal: true,
            anchorEl: () => calendarRef.current,
          }}
          renderInput={() => null} // Hides input field
        />

        <IconButton onClick={goToNextWeek}>
          <ChevronRightIcon sx={{ color: "grey.500" }} />
        </IconButton>
      </Box>

      {/* Tabular Data Display with Highlighted Selected Date */}
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              {weekDays.map((day, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    backgroundColor: highlightedDate === day.format("YYYY-MM-DD") ? "#d3e3fd" : "inherit", // Highlight selected date
                    fontWeight: highlightedDate === day.format("YYYY-MM-DD") ? "bold" : "normal", // Make text bold for selected date
                    border: highlightedDate === day.format("YYYY-MM-DD") ? "2px solid #1976d2" : "none", // Add a border to highlight
                    borderRadius: "4px",
                  }}
                >
                  {day.format("MMM D")}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </LocalizationProvider>
  );
};

WeeklyPicker.propTypes = {
  onChange: PropTypes.func,
};

export default WeeklyPicker;
