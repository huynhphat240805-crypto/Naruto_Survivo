using System;
using UnityEngine;

namespace SurvivalIO.Combat
{
    public enum StatusEffectType
    {
        None,
        Burn,
        Poison,
        Slow,
        Freeze
    }

    [Serializable]
    public class StatusEffectData
    {
        [SerializeField] private StatusEffectType _type;
        [SerializeField] private float _duration = 3f;
        [SerializeField] private float _tickInterval = 0.5f;
        [SerializeField] private float _damagePerTick = 5f;
        [SerializeField] private float _speedModifier = 0.5f;

        public StatusEffectType Type => _type;
        public float Duration => _duration;
        public float TickInterval => _tickInterval;
        public float DamagePerTick => _damagePerTick;
        public float SpeedModifier => _speedModifier;

        public StatusEffectData() { }

        public StatusEffectData(StatusEffectType type, float duration, float tickInterval, float damagePerTick, float speedModifier = 1f)
        {
            _type = type;
            _duration = duration;
            _tickInterval = tickInterval;
            _damagePerTick = damagePerTick;
            _speedModifier = speedModifier;
        }
    }
}

