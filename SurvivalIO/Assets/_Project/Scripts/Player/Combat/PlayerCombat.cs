using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Weapons;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Coordinates combat mechanics on the player, routing weapon management and damage interactions.
    /// </summary>
    public class PlayerCombat : MonoBehaviour
    {
        [SerializeField] private WeaponManager _weaponManager;
        [SerializeField] private LayerMask _enemyLayer;

        private void Awake()
        {
            if (_weaponManager == null) _weaponManager = GetComponent<WeaponManager>();
        }

        public void EquipStartingWeapon(WeaponDataSO weaponData)
        {
            if (_weaponManager != null && weaponData != null)
            {
                _weaponManager.AddWeapon(weaponData, _enemyLayer);
            }
        }
    }
}

