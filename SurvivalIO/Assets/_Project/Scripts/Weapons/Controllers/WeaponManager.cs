using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Coordinates all equipped weapons on the character.
    /// Manages weapon slots, level ups, and stat modifiers.
    /// </summary>
    public class WeaponManager : MonoBehaviour
    {
        [SerializeField] private int _maxWeapons = GameConstants.MAX_ACTIVE_WEAPONS;
        [SerializeField] private List<WeaponBase> _equippedWeapons = new List<WeaponBase>();

        public IReadOnlyList<WeaponBase> EquippedWeapons => _equippedWeapons;
        public bool HasFreeSlot => _equippedWeapons.Count < _maxWeapons;

        public bool AddWeapon(WeaponDataSO data, LayerMask targetLayer)
        {
            if (data == null) return false;

            WeaponBase existing = _equippedWeapons.Find(w => w.UpgradeId == data.Id);
            if (existing != null)
            {
                if (existing.CanUpgrade)
                {
                    existing.ApplyUpgrade();
                    return true;
                }
                return false;
            }

            if (!HasFreeSlot) return false;

            GameObject weaponObj = new GameObject($"[Weapon] {data.WeaponName}");
            weaponObj.transform.SetParent(transform);
            weaponObj.transform.localPosition = Vector3.zero;

            WeaponController controller = weaponObj.AddComponent<WeaponController>();
            // Use reflection or serialized backing field initialization
            var fieldData = typeof(WeaponBase).GetField("_data", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            var fieldLayer = typeof(WeaponBase).GetField("_targetLayer", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            fieldData?.SetValue(controller, data);
            fieldLayer?.SetValue(controller, targetLayer);

            controller.Initialize(transform);
            _equippedWeapons.Add(controller);
            return true;
        }

        public void UpgradeWeapon(string weaponId)
        {
            WeaponBase weapon = _equippedWeapons.Find(w => w.UpgradeId == weaponId);
            weapon?.ApplyUpgrade();
        }

        public void ApplyGlobalModifier(WeaponModifier globalMod)
        {
            foreach (var weapon in _equippedWeapons)
            {
                weapon.Modifier.DamageMultiplier = globalMod.DamageMultiplier;
                weapon.Modifier.CooldownMultiplier = globalMod.CooldownMultiplier;
                weapon.Modifier.AreaMultiplier = globalMod.AreaMultiplier;
                weapon.Modifier.SpeedMultiplier = globalMod.SpeedMultiplier;
                weapon.Modifier.AdditionalProjectiles = globalMod.AdditionalProjectiles;
                weapon.Modifier.AdditionalPierce = globalMod.AdditionalPierce;
            }
        }
    }
}

