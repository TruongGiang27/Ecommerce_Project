import React from "react";

export default function Profile() {
  const profile = JSON.parse(localStorage.getItem("profile") || "null");

  return (
    <div style={{ padding: "20px" }}>
      <h2>Thông tin cá nhân</h2>
      {profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <p>Không có thông tin profile</p>
      )}
    </div>
  );
}
