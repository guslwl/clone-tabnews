function status(request, response) {
    response.status(200).json({ status: "oloco" });
}

export default status;

