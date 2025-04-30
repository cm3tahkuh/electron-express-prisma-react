import { useEffect, useState } from "react";
import "./index.css";

interface User {
  id: number;
  name: string;
  password: string;
  age: number;
}

export const App: React.FC = () => {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3333/users");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="title">React + Express + Prisma ORM</h1>
      <h2 className="subtitle">Документация, которая может пригодиться</h2>
      <div>https://my-js.org/docs/guide/prisma/</div>
      <div>
        https://dev.to/samuel_kinuthia/building-a-restful-api-with-prisma-express-typescript-and-postgresql-333p
      </div>
      <h2 className="title">Пользователи</h2>
      <h2 className="subtitle">Список всех зарегистрированных пользователей</h2>
      <p className="description">
        Здесь представлены все пользователи системы.
      </p>
      <table className="user-table">
        <thead>
          <tr>
            <th>Идентификатор</th>
            <th>Имя</th>
            <th>Пароль</th>
            <th>Возраст</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.password}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
