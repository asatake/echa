defmodule EchaAppWeb.PageController do
  use EchaAppWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def room(conn, _params) do
    render(conn, "room.html")
  end

end
