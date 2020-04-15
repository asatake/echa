defmodule EchaAppWeb.RoomChannel do
  use EchaAppWeb, :channel

  def join("rooms:lobby", msg, socket) do
    Process.flag(:trap_exit, true)
    {:ok, socket}
  end

  def handle_in("change", %{"user" => user, "oldPos" => oldPos, "pos" => pos, "color" => color}, socket) do
    broadcast! socket, "change", %{"user" => user, "oldPos" => oldPos, "pos" => pos, "color" => color}
    {:noreply, socket}
  end

end
