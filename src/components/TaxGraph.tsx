import React, {useEffect, useState} from 'react';
import CustomCalendar from './CustomCalendar';
import { calculateTaxPercentage } from '../utils/TaxCalculator';
import './TaxGraph.css';

const TaxGraph: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [total, setTotal] = useState<number>(106900);
    const [tax, setTax] = useState<number>(6900);
    const [taxPercentage, setTaxPercentage] = useState<number>(0);

    useEffect(() => {
        setTaxPercentage(calculateTaxPercentage(total, tax));
    }, [total, tax]);


    return (
        <div className="tax-graph">
            <div className="tax-input-container">
                <label>Total:</label>
                <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))}/>
                <label>Tax:</label>
                <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))}/>
                <label>Tax Percentage: </label>
                <p style={{fontWeight: 'bold'}}>{taxPercentage.toFixed(2)}%</p>
            </div>


            <CustomCalendar year={currentYear} percentage={taxPercentage}/>
        </div>
    );
};

export default TaxGraph;
