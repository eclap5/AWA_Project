import { Cancel } from "@mui/icons-material"
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material"
import { FormEvent } from "react"
import "../styles/genreSelection.css"

interface GenreSelectProps {
    genreOptions: string[]
    genres: string[]
    setValue: (genres: string[]) => void
}

// Get genre options from constants and loop through them to create a dropdown menu
const GenreSelect: React.FC<GenreSelectProps> = ({ genreOptions, genres, setValue }) => {
    return (
        <FormControl className='genre-selection' sx={{ m: 1, width: 300 }}>
            <InputLabel id="select-genres">Genre</InputLabel>
            <Select
            multiple
            disabled={genres.length === 3}
            value={genres}
            onChange={(event) => setValue(event.target.value as string[])}
            input={<OutlinedInput label="Genre" />}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: string) => (
                    <Chip 
                        key={value} 
                        label={value}
                        onDelete={() =>
                        setValue(
                            genres.filter((item: string) => item !== value)
                        )
                        }
                        deleteIcon={
                        <Cancel onMouseDown={(event: FormEvent) => event.stopPropagation()} />
                        }
                        sx={{ background: 'white', color: 'black' }}
                    />
                    ))}
                </Box>
                )}
                MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 28 * genreOptions.length,
                        width: 250,
                    },
                },
            }}
            >
                {genreOptions.map((option: string) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default GenreSelect