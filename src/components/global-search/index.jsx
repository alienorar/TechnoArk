import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchInput = ({ updateParams, placeholder }) => {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const search_value = params.get("search") || "";
        setSearchValue(search_value);
    }, [search]);

    const handleSearchChange = (event) => {
        const newSearchValue = event.target.value;
        setSearchValue(newSearchValue);


        updateParams({ search: newSearchValue });
        const searchParams = new URLSearchParams(search);
        searchParams.set("search", newSearchValue);
        navigate(`?${searchParams}`);
    };

    return (
        <Input
            placeholder={placeholder}
            size="large"
            style={{ maxWidth: 260, minWidth: 20 }}
            onChange={handleSearchChange}
            value={searchValue}
        />
    );
};

export default SearchInput;
