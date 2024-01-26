import { Checkbox, FormControlLabel } from "@mui/material"
import React, { ChangeEvent } from "react"

interface CheckboxInputProps {
    label: string
    setChecked: (checked: boolean) => void
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, setChecked }) => {
    return (
        <FormControlLabel 
            control={<Checkbox onChange={(event: ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked)} />} 
            label={label} 
            labelPlacement="start"
        />
    )
}

export default CheckboxInput