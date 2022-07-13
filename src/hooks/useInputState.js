import { useState } from 'react';

const useInputState = (init) => {
    const initialState = init || '';

    const [value, setValue] = useState(initialState);

    const handleChange = (e) => setValue(e.target.value);

    const values = { value, onChange: handleChange};

    const handleReset = () => setValue(initialState);

    const handleSet = (set) => setValue(set);

    return { value, handleChange, handleReset, handleSet ,values};
};

export default useInputState