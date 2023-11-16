import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import MaskedInput from 'react-text-mask';
import './SearchForm.css'

interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, type, value, onChange }: InputFieldProps) => (
    <div>
        <label>{label}:</label>
        {type === 'text' ? (
            <MaskedInput
                mask={[/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                className="input-field"
                guide={false}
                value={value}
                onChange={onChange}
            />
        ) : (
            <input
                className="input-field"
                type={type}
                value={value}
                onChange={onChange}
                required={type === 'email'}
            />
        )}
    </div>
);

const fetchData = async (email: string, number: string, signal: AbortSignal) => {
    const response = await fetch('http://localhost:3000/users/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, number }),
        signal: signal
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

const SearchForm = () => {
    const [email, setEmail] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearched, setIsSearched] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();

        return () => {
            abortController.abort();
        };
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const abortController = new AbortController();

        try {
            const data = await fetchData(email, number, abortController.signal);
            setIsSearched(true);
            setResults(data.length ? data : []);
        } catch (e) {
            if (e instanceof Error && e.name !== 'AbortError') {
                console.error("Ошибка запроса:", e);
            }
        }
    };

    return  (
        <>
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <InputField
                    label="Number"
                    type="text"
                    value={number}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <div>
                {isSearched && (!results || results.length === 0) ? (
                    <p>Пользователи не найдены.</p>
                ) : (
                    results && results.map((user, index) => (
                        <div key={index}>
                            <p>Email: {user.email}</p>
                            <p>Number: {user.number}</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default SearchForm;
