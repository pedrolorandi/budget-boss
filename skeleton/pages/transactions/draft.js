import React, { useState } from "react";
import Form from "../../components/add-edit-delete/form";
import { PrismaClient } from '@prisma/client'
import axios from 'axios';

export default function CircleSelection() {
  const [selectedValue, setSelectedValue] = useState('');

  function handleSelectionChange(event) {
    setSelectedValue(event.target.value);
  }
  console.log(selectedValue);
  
  return (
    <div>
      <label>
        <input 
        type="radio" 
        name="circle" 
        value="male" 
        checked={selectedValue === "male"} 
        onChange={handleSelectionChange}
        style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid black', marginRight: '5px', backgroundColor: selectedValue === "female" ? 'black' : '#FFFFFF' }}
        />
        Male
      </label>

      <label>
        <input type="radio" name="circle" value="female" checked={selectedValue === "female"} onChange={handleSelectionChange} style={{ display: 'none' }} />
        <div style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid black', marginRight: '5px', backgroundColor: selectedValue === "female" ? 'black' : '#FFFFFF' }}>
          {selectedValue === "female" && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}>✓</div>}
        </div>
        Female
      </label>
    </div>
  );
}

//useRef()
import { useRef } from 'react';

function RadioButton() {
  const maleRadioRef = useRef(null);
  const femaleRadioRef = useRef(null);

  function handleMaleClick() {
    maleRadioRef.current.checked = true;
    femaleRadioRef.current.checked = false;
  }

  function handleFemaleClick() {
    maleRadioRef.current.checked = false;
    femaleRadioRef.current.checked = true;
  }

  return (
    <div>
      <label>
        <input type="radio" name="gender" value="male" ref={maleRadioRef} />
        Male
      </label>
      <br />
      <label>
        <input type="radio" name="gender" value="female" ref={femaleRadioRef} />
        Female
      </label>
      <br />
      <button onClick={handleMaleClick}>Select Male</button>
      <button onClick={handleFemaleClick}>Select Female</button>
    </div>
  );
}
