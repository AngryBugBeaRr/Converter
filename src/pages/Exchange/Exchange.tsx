import React, { useEffect, useState } from 'react';
import style from './Exchange.module.css';
import { Button, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';

const Exchange = () => {

    // Значение перевода валюты из(initialValue) в(newValue)
    const [initialValue, setInitialValue] = useState<number>(0);
    const [newValue, setNewValue] = useState<number>(0);

    // Обменный курс
    const [currency, setCurrency] = useState<number>(0);

    // Какую валюту(actualValueChosen) переводим в(newValueChosen)
    const [actualValueChosen, setActualValueChosen] = useState<string>('USD');
    const [newValueChosen, setNewValueChosen] = useState<string>('RUB');

    // Все валюты и их курс
    const [currentCurrency, setCurrentCurrency] = useState<{[index: string]: string}>();

    // Флаг для единоразвого получения всех валют
    const [flag, setFlag] = useState<boolean>(true);

    // Все валюты
    const [data, setData] = useState<string[]>(['RUB']);

    // Функция для получения всех валют и курсов
    const getCurrency = async (base: string) => {
        await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_KJjpxmMkxsotV7jEC74DBM20VDgGYgmdZOG06HyM&currencies=&base_currency=${base}`, {
            method: 'GET',
            redirect: 'follow',
        })
            .then(response => response.text())
            .then(result => setCurrentCurrency(JSON.parse(result)?.data))
            .catch(error => console.log('error', error));
    }

    // Получение обменного курса одной валюты в другую
    const getExchange = async (base: string, to: string) => {
        await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_KJjpxmMkxsotV7jEC74DBM20VDgGYgmdZOG06HyM&currencies=${to}&base_currency=${base}`, {
            method: 'GET',
            redirect: 'follow',
        })
            .then(response => response.text())
            .then(result => setCurrency(JSON.parse(result)?.data[to]))
            .catch(error => console.log('error', error));
    }

    // Функция подсчета
    const exchange = (val: number) => {
        setInitialValue(val);
        setNewValue(Number((val * currency).toFixed(2)));
    }

    // При изменении выбора валют обнуляем инпуты и получаем новый обменный курс
    useEffect(() => {
        setInitialValue(0);
        setNewValue(0);
        if (!currentCurrency) {
            getCurrency(actualValueChosen);
        }
        getExchange(actualValueChosen, newValueChosen);
    }, [actualValueChosen, newValueChosen]);

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
        <div className={style.container}>
            <Link className={'m-4 align-self-end'} to={'/currency'}>
                <Button>
                    Курсы валют
                </Button>
            </Link>
            <Col className={'border rounded align-self-center'} xs={10}>
                <Col className={'d-flex align-items-center justify-content-center my-3'}>
                    <Select
                        defaultValue={actualValueChosen}
                        style={{ width: 120, margin: 10 }}
                        onChange={(e) => setActualValueChosen(e)}
                        options={data.map((province) => ({ label: province, value: province }))}
                    />
                    <span>В</span>
                    <Select
                        defaultValue={newValueChosen}
                        style={{ width: 120, margin: 10 }}
                        onChange={(e) => setNewValueChosen(e)}
                        options={data.map((province) => ({ label: province, value: province }))}
                    />
                </Col>
                <Col className={'d-flex align-items-center justify-content-center my-3'}>
                    <Input
                        value={initialValue}
                        onChange={(e) => exchange(Number(e.target.value))}
                        className={style.InputConverter}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                         className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                              d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    <Input
                        value={newValue}
                        disabled
                        className={style.InputConverter}
                    />
                </Col>
            </Col>
        </div>
    );
}

export default Exchange;
