using System;
using System.Collections.Generic;
using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Service locator pattern implementation for decoupled subsystem discovery.
    /// </summary>
    public static class ServiceLocator
    {
        private static readonly Dictionary<Type, object> _services = new Dictionary<Type, object>();

        public static void Register<T>(T service) where T : class
        {
            Type type = typeof(T);
            if (_services.ContainsKey(type))
            {
                Debug.LogWarning($"[ServiceLocator] Overwriting registered service of type {type.Name}.");
            }
            _services[type] = service;
        }

        public static void Unregister<T>() where T : class
        {
            Type type = typeof(T);
            _services.Remove(type);
        }

        public static T Get<T>() where T : class
        {
            Type type = typeof(T);
            if (_services.TryGetValue(type, out object service))
            {
                return (T)service;
            }

            Debug.LogError($"[ServiceLocator] Service of type {type.Name} is not registered!");
            return null;
        }

        public static bool TryGet<T>(out T service) where T : class
        {
            Type type = typeof(T);
            if (_services.TryGetValue(type, out object obj))
            {
                service = (T)obj;
                return true;
            }

            service = null;
            return false;
        }

        public static void Reset()
        {
            _services.Clear();
        }
    }
}

