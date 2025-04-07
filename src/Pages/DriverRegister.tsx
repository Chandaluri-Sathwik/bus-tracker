import {  useState ,} from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../config/_axios';
import { Row, Col, Form, Button, Card } from "antd";
import { TextField, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import 'leaflet/dist/leaflet.css';
const DriverRegister = () => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate=useNavigate();
    const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      
      const response = await instance.post('/register-driver', {
        username: values.username,
        password: values.password,
        busNumber:values.busNumber
      });

      if (response.status === 201) {
        window.alert('Registered Successfully!!Redirecty to login page')
        navigate('/login')
      }
    } catch (error) {
      console.error('Login failed:', error);
      window.alert('Error Logging in ')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Row justify="center"   style={{ width:"100vw", maxWidth: "400px", margin:"0 auto" }}>
                <Col span={24}>
                    <Card
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "15px",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                            padding: "30px",
                            margin:"0 20px 0 20px"
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "600",
                                textAlign: "center",
                                color: "#333",
                                marginBottom: "20px",
                            }}
                        >
                           Register as a BusDriver
                        </h2>

                        <Form form={form} name="login" layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                name={"username"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your user name",
                                    },
                                ]}
                                label={
                                    <span style={{ fontWeight: "600", color: "#555" }}>
                                        Enter your Credentials:
                                    </span>
                                }
                            >
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="User Name"
                                    name="username"
                                    margin="normal"
                                    autoFocus
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "#ccc" },
                                            "&:hover fieldset": { borderColor: "#888" },
                                            "&.Mui-focused fieldset": { borderColor: "#6a11cb" },
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "18px 14px",
                                        },
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name={"busNumber"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your busNumber",
                                    },
                                ]}
                                label={
                                    <span style={{ fontWeight: "600", color: "#555" }}>
                                        Enter your Credentials:
                                    </span>
                                }
                            >
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="busNumber"
                                    label="Bus Number"
                                    name="busNumber"
                                    margin="normal"
                                    autoFocus
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "#ccc" },
                                            "&:hover fieldset": { borderColor: "#888" },
                                            "&.Mui-focused fieldset": { borderColor: "#6a11cb" },
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "18px 14px",
                                        },
                                    }}
                                />
                            </Form.Item>

                            <Form.Item name={"password"} rules={[{ required: true }]}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "#ccc" },
                                            "&:hover fieldset": { borderColor: "#888" },
                                            "&.Mui-focused fieldset": { borderColor: "#6a11cb" },
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "18px 14px",
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                sx={{ padding: "10px" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Form.Item>
                            <Form.Item style={{ textAlign: "center" }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    style={{
                                        background: "black",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "10px 0px",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "60%",
                                        justifyContent: "center",
                                        color: "#ccfeef",
                                        fontSize: "1rem",
                                    }}
                                    disabled={isLoading}
                                >
                                    Login !!
                                    {isLoading && (
                                        <div
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                border: "2px solid #ffffff",
                                                borderTop: "2px solid #6a11cb",
                                                borderRadius: "50%",
                                                animation: "spin 1s linear infinite",
                                                marginLeft: "10px",
                                            }}
                                        ></div>
                                    )}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

        {/* CSS for Spinner */}
            <style>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
    </>
  )
};

export default DriverRegister;