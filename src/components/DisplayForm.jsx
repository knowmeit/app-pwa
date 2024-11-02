import React,{useState} from "react";


const DisplayForm =()=>{
    const [national_code , set_national_code] = useState("");
    const [birthdate , set_birthdate] = useState("");

    const handleSubmit = async(event)=>{
        event.preventDefault();
    }

    return(
        <div>
            <p>اطلاعات خواسته شده را وارد کنید:</p>

            <div>
                <input type="text"/>
            
            </div>
        </div>
    );
}

export default DisplayForm