import { Checkbox, FormControlLabel } from "@mui/material"
import React, { ChangeEvent } from "react"

interface CheckboxInputProps {
    label: string
    setChecked: (checked: boolean) => void
    isChecked: boolean
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, setChecked, isChecked }) => {
    return (
        <FormControlLabel 
            control={<Checkbox onChange={(event: ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked)} />} 
            label={label} 
            labelPlacement="start"
            checked={isChecked}
        />
    )
}

export default CheckboxInput