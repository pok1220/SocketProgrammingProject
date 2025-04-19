export default async function userLogin(userEmail:string,userPassword:string) {
    console.log("hello",userEmail)
    console.log("password",userPassword)
    const response = await fetch (`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,{
        method:"post",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({
            email:userEmail,
            password:userPassword
        }),
    })

    if(!response.ok){
        throw new Error("Failed to login")
    }
    const res= await response.json()
    return res

}