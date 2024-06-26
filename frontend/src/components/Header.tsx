import  AppBar  from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";
const Header = () =>{
    const auth = useAuth();
    return (
        <AppBar sx ={{bgcolor:"transparent",position:"static",boxShadow:"none",}}>
            <Toolbar sx={{display:"flex"}}>
                <Logo/>
                <div>
                    {auth?.isLoggedIn?(
                        <>
                            <NavigationLink bg = "#00fffc" to="/chat" text ="Start Interview" textColor="black"/>
                            <NavigationLink bg = "#51538f" to="/" text ="Logout" textColor="white" onClick={auth.logout}/>
                        </>
                        ):(
                        <>
                            <NavigationLink bg = "#00fffc" to="/login" text ="Login" textColor="black"/>
                        </>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;