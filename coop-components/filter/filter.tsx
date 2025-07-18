import React, { useState } from 'react';
import { FilterProps } from '../../types/filter/FilterProps';
import TextField from '../field/TextField';
import LookupField from '../field/LookupField';
import Button from '../button/Button';
// import './Filter.css';

const FilterComponent: React.FC<FilterProps> = ({ showFilter, okClick }) => {
    if (!showFilter) return null;

    const [description, setDescription] = useState<string>('');
    const [type, setType] = useState<string>('PIX');

    const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setDescription(value);
    };

    const onChangeTransactionType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
    };
    
    return (
        <div className="modal-overlay">
            <div className={`modal-filter`}>
                <div className="modal-content">
                    <div>
                      <div className="grid-filter">
                        <TextField
                                id="destinatario"
                                className="text-field"
                                label="Destinatário"
                                placeholder="Destinatário"
                                value={description}
                                onChange={onChangeDescription}/>

                        <LookupField
                                    id="tipo-transacao"
                                    className="lookup-field"
                                    label="Tipo de transação"
                                    options={["PIX", "TED"]}
                                    placeholder="Tipo de transação"
                                    value={type}
                                    onChange={onChangeTransactionType}
                                />
                      </div>
                      <div className='button-filter'>
                        <Button className="button" title="Filtrar" action={() => okClick({ description:description, type:type })} />
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;