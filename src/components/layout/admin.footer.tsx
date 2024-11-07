"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Web cua tui ©{new Date().getFullYear()} Created by @ng.tahhoang
      </Footer>
    </>
  );
};

export default AdminFooter;
