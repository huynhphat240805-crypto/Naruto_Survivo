using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Combat
{
    /// <summary>
    /// Coordinates ongoing status effects (burn, poison, slow, freeze).
    /// </summary>
    public class StatusEffectController : MonoBehaviour
    {
        private IDamageable _damageable;
        private readonly Dictionary<StatusEffectType, Coroutine> _activeEffects = new Dictionary<StatusEffectType, Coroutine>();

        public float SpeedMultiplier { get; private set; } = 1f;

        private void Awake()
        {
            _damageable = GetComponent<IDamageable>();
        }

        public void ApplyEffect(StatusEffectData effectData)
        {
            if (effectData == null || effectData.Type == StatusEffectType.None) return;

            if (_activeEffects.TryGetValue(effectData.Type, out Coroutine running))
            {
                StopCoroutine(running);
                _activeEffects.Remove(effectData.Type);
            }

            Coroutine routine = StartCoroutine(ProcessEffect(effectData));
            _activeEffects[effectData.Type] = routine;
        }

        private IEnumerator ProcessEffect(StatusEffectData data)
        {
            if (data.SpeedModifier < 1f)
            {
                SpeedMultiplier = data.SpeedModifier;
            }

            float elapsed = 0f;
            float tickTimer = 0f;

            while (elapsed < data.Duration)
            {
                yield return null;
                elapsed += Time.deltaTime;
                tickTimer += Time.deltaTime;

                if (tickTimer >= data.TickInterval)
                {
                    tickTimer = 0f;
                    if (data.DamagePerTick > 0f && _damageable != null && _damageable.IsAlive)
                    {
                        _damageable.TakeDamage(data.DamagePerTick, false);
                    }
                }
            }

            if (data.SpeedModifier < 1f)
            {
                SpeedMultiplier = 1f;
            }

            _activeEffects.Remove(data.Type);
        }

        public void ClearEffects()
        {
            foreach (var routine in _activeEffects.Values)
            {
                if (routine != null) StopCoroutine(routine);
            }
            _activeEffects.Clear();
            SpeedMultiplier = 1f;
        }
    }
}

