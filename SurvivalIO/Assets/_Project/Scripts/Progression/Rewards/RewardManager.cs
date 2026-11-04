using UnityEngine;

namespace SurvivalIO.Progression
{
    /// <summary>
    /// Computes end-of-match rewards based on survival time and kill count.
    /// </summary>
    public class RewardManager : MonoBehaviour
    {
        [SerializeField] private float _coinsPerMinute = 50f;
        [SerializeField] private float _coinsPerKill = 2f;

        public int CalculateRewardCoins(float survivalTimeSeconds, int killCount)
        {
            float timeMinutes = survivalTimeSeconds / 60f;
            float total = (timeMinutes * _coinsPerMinute) + (killCount * _coinsPerKill);
            return Mathf.RoundToInt(Mathf.Max(0f, total));
        }
    }
}

