using System;
using UnityEngine;

namespace SurvivalIO.Items
{
    /// <summary>
    /// Tracks match-session collected items, gold coins, and chests.
    /// </summary>
    public class InventoryManager : MonoBehaviour
    {
        [SerializeField] private int _matchCoins;
        [SerializeField] private int _chestsOpened;

        public int MatchCoins => _matchCoins;
        public int ChestsOpened => _chestsOpened;

        public event Action<int> OnCoinsChanged;

        public void AddCoins(int amount)
        {
            if (amount <= 0) return;
            _matchCoins += amount;
            OnCoinsChanged?.Invoke(_matchCoins);
        }

        public void RegisterChestOpened()
        {
            _chestsOpened++;
        }

        public void ResetSession()
        {
            _matchCoins = 0;
            _chestsOpened = 0;
            OnCoinsChanged?.Invoke(0);
        }
    }
}

