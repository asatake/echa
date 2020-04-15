defmodule EchaAppWeb.Router do
  use EchaAppWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", EchaAppWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/room", PageController, :room
  end

end
