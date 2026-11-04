using UnityEngine;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Concrete weapon implementation executing attacks according to WeaponDataSO configuration.
    /// </summary>
    public class WeaponController : WeaponBase
    {
        public override void Fire()
        {
            var stats = CurrentStats;
            if (stats == null || _data == null || _owner == null) return;

            switch (_data.AttackType)
            {
                case WeaponAttackType.NearestTarget:
                    WeaponAttack.ExecuteNearestTargetAttack(_owner, stats, _modifier, _data.ProjectilePrefab, _targetLayer);
                    break;

                case WeaponAttackType.Directional:
                    Vector2 dir = _owner.localScale.x >= 0 ? Vector2.right : Vector2.left;
                    WeaponAttack.ExecuteDirectionalAttack(_owner, dir, stats, _modifier, _data.ProjectilePrefab, _targetLayer);
                    break;

                case WeaponAttackType.AreaOfEffect:
                    WeaponAttack.ExecuteAreaOfEffectAttack(_owner.position, stats, _modifier, _targetLayer);
                    break;

                case WeaponAttackType.Orbital:
                    // Spawns/updates orbiting shields or projectiles around player
                    WeaponAttack.ExecuteAreaOfEffectAttack(_owner.position, stats, _modifier, _targetLayer);
                    break;
            }
        }
    }
}

