import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrlLaboratory = 'http://localhost:5000';
const apiUrlOTK = 'http://localhost:8000';
const apiUrlAuth = 'http://127.0.0.1:8001';

function Main() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [tableData, setTableData] = useState<{
    id: number;
    date: string;
    time: string;
    brazier_1_Humidity: string;
    brazier_2_Humidity: string;
    press_1_Fat_Content: string;
    press_2_Fat_Content: string;
    press_1_Moisture_content: string;
    press_2_Moisture_content: string;
    humidity: string;
    protein: string;
    non_fat_after: string;
    acid_number: string;
    note: string;
  }[]>([]);
  
  const [sampleData, setSampleData] = useState<{
  sample_id: number;
  sampling_point: string;
  workshop_id: number;
  container_number: string;
  product_id: number;
  user_id: number;
  }[]>([]);

  const [shipmentData, setShipmentData] = useState<{
    shipment_id: number;
    container_number: string;
    purchaser_country: string;
    shipment_date: string;
    status: string;
    returned: boolean;
    gross_weight: number;
    container_weight: number;
    net_weight: number;
    product_id: number;
    user_id: number;
    product: string;
  }[]>([]);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const navigate = useNavigate();


  const tabNames = ["Лаборатория", "ОТК", "Другой Таб", "Другой Таб"];
  const tabWrapperRef = useRef<HTMLDivElement | null>(null);

  const checkAuthTokenAndRedirect = () => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      navigate('/Login');
    }
  };
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`${apiUrlAuth}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        });
        const userData = response.data;
        const userId = userData.user_id;
        setUserId(userId);
  
        if (userId) {
          const userResponse = await axios.get(`${apiUrlAuth}/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            },
          });
          const user = userResponse.data;
          setUserName(user.username);
        } else {
          setUserName("Пользователь не найден");
        }
      } catch (error) {
        console.error('Ошибка при получении данных о пользователе:', error);
      }
    }

    checkAuthTokenAndRedirect();
  
    fetchUserData();
  }, []);
  
  
  async function fetchData() {
    try {
      const response = await axios.get(`${apiUrlLaboratory}/map-products-press-shop/getAll`);
      const data = response.data;
      setTableData(data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchSampleData() {
      try {
        const response = await axios.get(`${apiUrlOTK}/api/samples`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        });
        const data = response.data;
        setSampleData(data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    }
  
    fetchSampleData();
  }, []);
  
  useEffect(() => {
    async function fetchShipmentData() {
      try {
        const response = await axios.get(`${apiUrlOTK}/api/shipments`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        });
        const data = response.data;
        setShipmentData(data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    }
  
    fetchShipmentData();
  }, []);
  

  const handleTabChange = (tabNumber: number) => {
    setActiveTab(tabNumber);

    if (tabWrapperRef.current) {
      const tab = tabWrapperRef.current.querySelector(`.${styles.tab}:nth-child(${tabNumber})`) as HTMLElement;
      if (tab) {
        const scrollLeft = tab.offsetLeft - (tabWrapperRef.current.clientWidth - tab.clientWidth) / 2;
        tabWrapperRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  const handleTabScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const tabsContainer = tabWrapperRef.current;

    if (tabsContainer) {
      tabsContainer.scrollLeft += delta;
    }
  };

  const navigateToLogin = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    window.location.href = '/Login';
  };



  return (
    <div className={styles.fon}>
      <div className={`${styles.light} ${styles.x1}`}></div>
      <div className={`${styles.light} ${styles.x2}`}></div>
      <div className={`${styles.light} ${styles.x3}`}></div>
      <div className={`${styles.light} ${styles.x4}`}></div>
      <div className={`${styles.light} ${styles.x5}`}></div>
      <div className={`${styles.light} ${styles.x6}`}></div>
      <div className={`${styles.light} ${styles.x7}`}></div>
      <div className={`${styles.light} ${styles.x8}`}></div>
      <div className={`${styles.light} ${styles.x9}`}></div>

      <div className={styles.appContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Модуль главного технолога</h1>
          <h1 className={styles.userName}>{userName}</h1>
          <button className={styles.logoutButton} onClick={navigateToLogin}>Выйти</button>
        </header>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs} ref={tabWrapperRef} onWheel={(e) => handleTabScroll(e)}>
            {tabNames.map((tabName, index) => (
              <div
                key={index}
                className={`${styles.tab} ${activeTab === index + 1 ? styles.activeTab : ''}`}
                onClick={() => handleTabChange(index + 1)}
              >
                {tabName}
              </div>
            ))}
          </div>

          <div className={styles.tabsContent}>
            {activeTab === 1 && (
              <div className={styles.laboratory}>
              <div className={styles.tablesList}>
  <ul>
    <li
      onClick={() => setSelectedItem(selectedItem === 1 ? null : 1)}
      className={selectedItem === 1 ? styles.activeTable : ''}
    >
      Карта продуктов прессового цеха
    </li>
  </ul>
</div>

                {selectedItem === 1 && (
                  <div className={styles.table1Content}>
           <div className={styles.tableConteaner}>
  <div className={styles.tableHead}>
  <table>
  <thead>
    <tr>
      <th className={`${styles.headerCell} ${styles.topLeftCornerCell}`} rowSpan={2}>Номер</th>
      <th className={styles.headerCell} rowSpan={2}>Дата</th>
      <th className={styles.headerCell} rowSpan={2}>Время</th>
      <th className={styles.headerCell} colSpan={2}>После жаровни</th>
      <th className={styles.headerCell} colSpan={4}>После винтового пресса</th>
      <th className={styles.headerCell} colSpan={2}>Жмых после охлаждения</th>
      <th className={styles.headerCell} colSpan={2}>Декантер</th>
      <th className={`${styles.headerCell} ${styles.topRightCornerCell}`} rowSpan={2}>Примечание</th>
    </tr>
    <tr>
      <th className={styles.headerCell}>Жаровня 1</th>
      <th className={styles.headerCell}>Жаровня 2</th>
      <th className={styles.headerCell}>Пресс 1</th>
      <th className={styles.headerCell}>Пресс 2</th>
      <th className={styles.headerCell}>Пресс 1</th>
      <th className={styles.headerCell}>Пресс 2</th>
      <th className={styles.headerCell}>Влажность</th>
      <th className={styles.headerCell}>Протеин</th>
      <th className={styles.headerCell}>Нежировые после</th>
      <th className={styles.headerCell}>Кислотное число</th>
    </tr>
  </thead>
</table>

  </div>
  <div className={styles.tableBody}>
    <table>
      <tbody>
        {tableData.map((rowData, index) => (
          <tr key={index}>
            <td className={styles.bodyCell}>{rowData.id}</td>
            <td className={styles.bodyCell}>{rowData.date}</td>
            <td className={styles.bodyCell}>{rowData.time}</td>
            <td className={styles.bodyCell}>{rowData.brazier_1_Humidity}</td>
            <td className={styles.bodyCell}>{rowData.brazier_2_Humidity}</td>
            <td className={styles.bodyCell}>{rowData.press_1_Fat_Content}</td>
            <td className={styles.bodyCell}>{rowData.press_2_Fat_Content}</td>
            <td className={styles.bodyCell}>{rowData.press_1_Moisture_content}</td>
            <td className={styles.bodyCell}>{rowData.press_2_Moisture_content}</td>
            <td className={styles.bodyCell}>{rowData.humidity}</td>
            <td className={styles.bodyCell}>{rowData.protein}</td>
            <td className={styles.bodyCell}>{rowData.non_fat_after}</td>
            <td className={styles.bodyCell}>{rowData.acid_number}</td>
            <td className={styles.bodyCell}>{rowData.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
                  </div>
                )}
                {selectedItem === 2 && (
                  <div className={styles.table2Content}>
                    {/* Content for таблица 2 */}
                  </div>
                )}
                {selectedItem === 3 && (
                  <div className={styles.table3Content}>
                    {/* Content for таблица 3 */}
                  </div>
                )}
              </div>
            )}
            {activeTab === 2 && (
              <div className={styles.OTK}>
                <div className={styles.tablesList}>
                  <ul>
                  <li
      onClick={() => setSelectedItem(selectedItem === 1 ? null : 1)}
      className={selectedItem === 1 ? styles.activeTable : ''}
    >
      Образцы 
    </li>
    <li
      onClick={() => setSelectedItem(selectedItem === 2 ? null : 2)}
      className={selectedItem === 2 ? styles.activeTable : ''}
    >
      Отгрузка
    </li>
                    
                  </ul>
                </div>
                {selectedItem === 1 && (
                  <div className={styles.table1Content}>
           <div className={styles.tableConteaner}>
  <div className={styles.tableHead}>
    <table>
      <thead>
        <tr>
          <th className={styles.headerCell}>идентификатор образца</th>
          <th className={styles.headerCell}>точка отбора проб</th>
          <th className={styles.headerCell}>идентификатор мастерской</th>
          <th className={styles.headerCell}>номер контейнера</th>
          <th className={styles.headerCell}>идентификатор продукта</th>
          <th className={styles.headerCell}>идентификатор пользователя</th>
        </tr>
      </thead>
    </table>
  </div>
  <div className={styles.tableBody}>
    <table>
      <tbody>
        {sampleData.map((rowData, index) => (
         <tr key={index}>
         <td className={styles.bodyCell}>{rowData.sample_id}</td>
         <td className={styles.bodyCell}>{rowData.sampling_point}</td>
         <td className={styles.bodyCell}>{rowData.workshop_id}</td>
         <td className={styles.bodyCell}>{rowData.container_number}</td>
         <td className={styles.bodyCell}>{rowData.product_id}</td>
         <td className={styles.bodyCell}>{rowData.user_id}</td>
       </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
                  </div>
                )}
                {selectedItem === 2 && (
                  <div className={styles.table1Content}>
                       <div className={styles.tableConteaner}>
  <div className={styles.tableHead}>
    <table>
      <thead>
        <tr>
          <th className={styles.headerCell}>идентификатор отгрузки</th>
          <th className={styles.headerCell}>номер контейнера</th>
          <th className={styles.headerCell}>страна покупателя</th>
          <th className={styles.headerCell}>дата отгрузки</th>
          <th className={styles.headerCell}>статус</th>
          <th className={styles.headerCell}>возврат</th>
          <th className={styles.headerCell}>общий вес</th>
          <th className={styles.headerCell}>вес контейнера</th>
          <th className={styles.headerCell}>вес нетто</th>
          <th className={styles.headerCell}>идентификатор продукта</th>
          <th className={styles.headerCell}>идентификатор пользователя</th>
        </tr>
      </thead>
    </table>
  </div>
  <div className={styles.tableBody}>
    <table>
      <tbody>
        {shipmentData.map((rowData, index) => (
          <tr key={index}>
            <td className={styles.bodyCell}>{rowData.shipment_id}</td>
            <td className={styles.bodyCell}>{rowData.container_number}</td>
            <td className={styles.bodyCell}>{rowData.purchaser_country}</td>
            <td className={styles.bodyCell}>{rowData.shipment_date}</td>
            <td className={styles.bodyCell}>{rowData.status}</td>
            <td className={styles.bodyCell}>{rowData.returned}</td>
            <td className={styles.bodyCell}>{rowData.gross_weight}</td>
            <td className={styles.bodyCell}>{rowData.container_weight}</td>
            <td className={styles.bodyCell}>{rowData.net_weight}</td>
            <td className={styles.bodyCell}>{rowData.product_id}</td>
            <td className={styles.bodyCell}>{rowData.user_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
                  </div>
                )}
                {selectedItem === 3 && (
                  <div className={styles.table3Content}>
                    {/* Content for таблица 3 */}
                  </div>
                )}
              
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
