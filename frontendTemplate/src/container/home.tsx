import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { useAppDispatch } from "../redux/hooks";
import { useEffect } from "react";
import { getUserList } from "../redux/store/user/action";

export const Home = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getUserList())
        console.log('i fire once');

    },[])
  

  const { userList, loading, error } = useSelector((state: RootState) => state.user);
    return(
        <div>
            Home
            {JSON.stringify(userList)}
        </div>
    )
}