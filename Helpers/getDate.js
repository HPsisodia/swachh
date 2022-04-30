// exports.getDate = () => {
//     // Date object initialized as per New Zealand timezone. Returns a datetime string
//     let india_date_string = new Date().toLocaleString("en-US", { timeZone: "Asia/Mumbai" });

//     let date_india = new Date(india_date_string);

//     // year as (YYYY) format
//     let year = date_india.getFullYear();

//     // month as (MM) format
//     let month = ("0" + (date_india.getMonth() + 1)).slice(-2);

//     // date as (DD) format
//     let date = ("0" + date_india.getDate()).slice(-2);

//     let finalDate =  year + "-" + month + "-" + date;

//     console.log(finalDate);

//     return finalDate;
// }