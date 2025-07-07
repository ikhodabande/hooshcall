import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/red.css";


export default function ShamsiCalendare({ onDateChange } : any) {
  const [value, setValue] = useState();

  const handleChange = (newValue :any) => {
    setValue(newValue);
    onDateChange(newValue);
  };

  return (
    <div style={{ direction: "rtl" }}>
      <DatePicker
        maxDate={new DateObject({ calendar: persian }).set(
          "day",
          new DateObject({ calendar: persian }).day
        )}
        style={{
          width: "50%",
          padding: 0 ,
          margin: 0,
          color: "#1b1b1b",
          height: "30px",
          textAlign: "center",
        }}
       
        className="red  mx-4"
        hideOnScroll
        value={value}
        onChange={handleChange}
        locale={persian_fa}
        calendar={persian}
        calendarPosition="bottom"
        
      />
    </div>
  );
}
