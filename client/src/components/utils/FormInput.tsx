import { TextField } from "@mui/material"
import { ChangeEvent } from "react"

interface FormInputProps {
    label: string
    type: string
    required: boolean
    value: string
    setValue: (value: string) => void

}

const FormInput: React.FC<FormInputProps> = ({ label, type, required, value, setValue }) => {
    return (
        <TextField 
            inputProps={{ style: {color: 'white'}}}
            InputLabelProps={{ style: {color: 'white'}}}
            label={label} 
            type={type}
            required={required}
            value={value} 
            onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)} 
        />
    )
}

export default FormInput