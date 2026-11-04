using System;
using UnityEngine;

namespace SurvivalIO.Progression
{
    /// <summary>
    /// Computes experience thresholds and manages level-up calculations.
    /// </summary>
    public class ExperienceManager : MonoBehaviour
    {
        [SerializeField] private float _baseExpRequired = 10f;
        [SerializeField] private float _growthMultiplier = 1.35f;

        public float GetRequiredExpForLevel(int level)
        {
            if (level <= 1) return _baseExpRequired;
            return Mathf.Round(_baseExpRequired * Mathf.Pow(level, _growthMultiplier));
        }
    }
}

