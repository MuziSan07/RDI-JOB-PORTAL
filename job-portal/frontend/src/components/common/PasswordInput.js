import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * A password <input> with a show/hide (eye) toggle.
 * Pass the same `style` you'd give a normal input; the component reserves room
 * on the right for the eye button and positions it. `iconColor` tunes the eye
 * color for light vs dark forms.
 */
const PasswordInput = ({
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    name,
    minLength,
    style = {},
    iconColor = '#94a3b8',
    wrapperStyle = {},
}) => {
    const [show, setShow] = useState(false);
    return (
        <div style={{ position: 'relative', width: '100%', ...wrapperStyle }}>
            <input
                type={show ? 'text' : 'password'}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                minLength={minLength}
                style={{ ...style, paddingRight: 44, boxSizing: 'border-box', width: '100%' }}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                tabIndex={-1}
                aria-label={show ? 'Hide password' : 'Show password'}
                style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: iconColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
                }}
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
};

export default PasswordInput;
