using UnityEngine;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Translates projectiles along specified directions or trajectories.
    /// </summary>
    public class ProjectileMovement : MonoBehaviour
    {
        [SerializeField] private float _speed = 10f;
        private Vector2 _direction = Vector2.right;

        public void SetSpeed(float speed) => _speed = speed;
        public void SetDirection(Vector2 direction)
        {
            _direction = direction.normalized;
            float angle = Mathf.Atan2(_direction.y, _direction.x) * Mathf.Rad2Deg;
            transform.rotation = Quaternion.Euler(0, 0, angle);
        }

        private void Update()
        {
            transform.position += (Vector3)(_direction * (_speed * Time.deltaTime));
        }
    }
}

