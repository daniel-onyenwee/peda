export default (statusCode:number, data:App.ApiResponseData): Response => {
    return new Response(JSON.stringify(data), {
        status: statusCode,
        headers: {
          "Content-Type": "application/json"
        }
    })
}