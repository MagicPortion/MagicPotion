import { PixiAppProvider } from "./contexts/PixiAppContext";
import GameManager from "./components/GameManager";

export default function App() {
  return (
    <PixiAppProvider>
      <GameManager />
    </PixiAppProvider>
  );
}
