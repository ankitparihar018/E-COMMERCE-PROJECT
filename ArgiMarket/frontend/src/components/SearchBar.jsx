import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search products..." }) => {

    return (
        <div className="relative w-full">

            <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

        </div>
    );
};

export default SearchBar;