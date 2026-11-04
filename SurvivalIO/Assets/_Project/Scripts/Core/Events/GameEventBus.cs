using System;
using System.Collections.Generic;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Type-safe, decoupled event aggregator for game-wide notifications.
    /// </summary>
    public static class GameEventBus
    {
        private static readonly Dictionary<Type, List<Delegate>> _subscribers = new Dictionary<Type, List<Delegate>>();

        public static void Subscribe<T>(Action<T> handler)
        {
            Type eventType = typeof(T);
            if (!_subscribers.ContainsKey(eventType))
            {
                _subscribers[eventType] = new List<Delegate>();
            }
            _subscribers[eventType].Add(handler);
        }

        public static void Unsubscribe<T>(Action<T> handler)
        {
            Type eventType = typeof(T);
            if (_subscribers.TryGetValue(eventType, out List<Delegate> list))
            {
                list.Remove(handler);
                if (list.Count == 0)
                {
                    _subscribers.Remove(eventType);
                }
            }
        }

        public static void Publish<T>(T eventArgs)
        {
            Type eventType = typeof(T);
            if (_subscribers.TryGetValue(eventType, out List<Delegate> list))
            {
                // Iterate over a copy to allow handlers to safely unsubscribe during execution
                var copy = new List<Delegate>(list);
                for (int i = 0; i < copy.Count; i++)
                {
                    if (copy[i] is Action<T> action)
                    {
                        action.Invoke(eventArgs);
                    }
                }
            }
        }

        public static void Clear()
        {
            _subscribers.Clear();
        }
    }

    #region Standard Events
    public struct PlayerDiedEvent { }
    public struct PlayerLevelUpEvent { public int NewLevel; }
    public struct EnemyKilledEvent { public int TotalKills; public string EnemyType; }
    public struct BossDefeatedEvent { public string BossName; }
    public struct GameStateChangedEvent { public GameStateType PreviousState; public GameStateType NewState; }
    #endregion
}

