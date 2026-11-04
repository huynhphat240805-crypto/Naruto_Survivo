namespace SurvivalIO.Core
{
    public enum GameStateType
    {
        None,
        Bootstrap,
        MainMenu,
        CharacterSelect,
        Playing,
        Paused,
        LevelUp,
        GameOver,
        Result,
        Settings
    }

    /// <summary>
    /// Contract for game state handlers within the State Pattern.
    /// </summary>
    public interface IGameState
    {
        GameStateType StateType { get; }
        void Enter();
        void Update();
        void Exit();
    }
}

