function status(request, response) {
  response.status(200).json({ chave: "em tempo real" });
}

export default status;
