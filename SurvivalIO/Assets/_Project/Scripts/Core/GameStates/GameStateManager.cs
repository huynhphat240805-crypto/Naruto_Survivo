using System.Collections.Generic;
using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Manages high-level game states using the State Pattern.
    /// </summary>
    public class GameStateManager : MonoBehaviour
    {
        private static GameStateManager _instance;
        public static GameStateManager Instance => _instance;

        private readonly Dictionary<GameStateType, IGameState> _states = new Dictionary<GameStateType, IGameState>();
        private IGameState _currentState;

        public GameStateType CurrentStateType => _currentState?.StateType ?? GameStateType.None;

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Update()
        {
            _currentState?.Update();
        }

        public void RegisterState(IGameState state)
        {
            if (state == null) return;
            _states[state.StateType] = state;
        }

        public void ChangeState(GameStateType newStateType)
        {
            if (_currentState != null && _currentState.StateType == newStateType)
                return;

            GameStateType previousType = CurrentStateType;

            _currentState?.Exit();

            if (_states.TryGetValue(newStateType, out IGameState nextState))
            {
                _currentState = nextState;
                _currentState.Enter();
            }
            else
            {
                // Default fallback state wrapper if specific class not registered
                _currentState = new DefaultGameState(newStateType);
                _currentState.Enter();
            }

            GameEventBus.Publish(new GameStateChangedEvent
            {
                PreviousState = previousType,
                NewState = newStateType
            });
        }

        private class DefaultGameState : IGameState
        {
            public GameStateType StateType { get; }

            public DefaultGameState(GameStateType type)
            {
                StateType = type;
            }

            public void Enter()
            {
                switch (StateType)
                {
                    case GameStateType.Paused:
                    case GameStateType.LevelUp:
                        Time.timeScale = 0f;
                        break;
                    case GameStateType.Playing:
                        Time.timeScale = 1f;
                        break;
                }
            }

            public void Update() { }

            public void Exit()
            {
                if (StateType == GameStateType.Paused || StateType == GameStateType.LevelUp)
                {
                    Time.timeScale = 1f;
                }
            }
        }
    }
}

