import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div>
            <h2>404 - Không tìm thấy trang</h2>
            <Link to="/">Quay lại trang chủ</Link>
        </div>
    );
};

export default NotFound;