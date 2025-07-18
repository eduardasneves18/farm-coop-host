import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFilter } from '@fortawesome/free-solid-svg-icons';
// import './Button.css';

const FilterIconButton: React.FC<{ className?: string; onClick: () => void}> = ({ className, onClick }) => {

    const handleClick = () => {
        onClick();
    }

    return (
        <div className={className}>
            <button onClick={handleClick} className="icon-button filter-button">
                <FontAwesomeIcon icon={faFilter} />
            </button>
        </div>
    );
};

export default FilterIconButton;