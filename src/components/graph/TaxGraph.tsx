import React, {useEffect, useState} from 'react';
import CustomCalendar from './CustomCalendar';
import {calculateTaxPercentage} from '../../utils/taxCalculator';
import './TaxGraph.css';

const TaxGraph: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [total, setTotal] = useState<number>(105000);
    const [tax, setTax] = useState<number>(32146);
    const [taxPercentage, setTaxPercentage] = useState<number>(0);

    useEffect(() => {
        setTaxPercentage(calculateTaxPercentage(total, tax));
    }, [total, tax]);


    return (
        <>
            <h1 style={{color: "#691f74", textAlign: "center"}}>Yearly Tax Graph</h1>

            <div className="tax-graph">
                <div className="tax-info-container">
                    <div>
                        <label>Income:</label>
                        <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))}/>
                    </div>

                    <div>
                        <label>Tax:</label>
                        <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))}/>
                    </div>

                    <div className={"tax-percentage-container"}>
                        <label>Tax Percentage: </label>
                        <p style={{fontWeight: 'bold', color: 'red'}}>{taxPercentage.toFixed(2)}%</p>
                    </div>
                </div>

                <CustomCalendar year={currentYear} percentage={taxPercentage}/>
            </div>
        </>
    );
};

export default TaxGraph;
