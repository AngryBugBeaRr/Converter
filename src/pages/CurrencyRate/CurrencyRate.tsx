import style from './CurrencyRate.module.css';
import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const CurrencyRate = () => {
    const [actualValue, setActualValue] = useState<string>('USD');
    const [currentCurrency, setCurrentCurrency] = useState<{[index: string]: string}>();
    const [flag, setFlag] = useState<boolean>(true);
    const [data, setData] = useState<string[]>(['USD']);

    const getCurrency = async (base: string) => {
        await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_KJjpxmMkxsotV7jEC74DBM20VDgGYgmdZOG06HyM&currencies=&base_currency=${base}`, {
            method: 'GET',
            redirect: 'follow',
        })
            .then(response => response.text())
            .then(result => setCurrentCurrency(JSON.parse(result)?.data))
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        getCurrency(actualValue);
    }, [actualValue]);

    useEffect(() => {
        if (flag && currentCurrency) {
            let newData = [];
            for (const key in currentCurrency) {
                newData.push(key);
            }
            setData([...data, ...newData]);
            setFlag(false);
        }
    }, [currentCurrency]);

    return (
        <div className={`${style.container} d-flex flex-column mb-5`}>
            <Col>
                <div className={'d-flex justify-content-between p-4'}>
                    <div className={'d-flex'}>
                        <h2>Основная валюта: </h2>
                        <Select
                            defaultValue={data[0]}
                            style={{ width: 120, alignSelf: 'center', marginLeft: 10 }}
                            onChange={(e) => setActualValue(e)}
                            options={data.map((province) => ({ label: province, value: province }))}
                        />
                    </div>
                    <Link to={'/'}>
                        <Button>
                            Конвертер валют
                        </Button>
                    </Link>
                </div>
            </Col>
            <Col xs={10} className={'align-self-center mt-4'}>
                <Row>
                    <Col className={'border'} xs={6}>Валюта</Col>
                    <Col className={'border'} xs={6}>Значение</Col>
                </Row>
                {currentCurrency && Object.keys(currentCurrency).map(item => {
                    return (
                        <Row>
                            <Col className={'border'} xs={6}>{item}</Col>
                            <Col className={'border'} xs={6}>
                                {Number(currentCurrency[item]).toFixed(2)}
                            </Col>
                        </Row>
                    )
                })}
            </Col>
        </div>
    )
}
